import { useEffect, useMemo, useState } from "react";
import { deleteCustomer, getCustomers } from "../../services/customerService";
import type { Customer } from "../../types/customer.types";
import "../ProtectedPages.css";
import "./AdminDashboardPage.css";

type SortField = "name" | "email" | "age" | "registrationDate";
type SortDirection = "asc" | "desc";
type RoleFilter = "ALL" | "USER" | "ADMIN";

export default function AdminDashboardPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
    const [advertisingOnly, setAdvertisingOnly] = useState<boolean>(false);
    const [sortField, setSortField] = useState<SortField>("registrationDate");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    useEffect(() => {
        async function loadCustomers() {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error(error);
                setError("We couldn't load customers.");
            } finally {
                setLoading(false);
            }
        }

        loadCustomers();
    }, []);

    const totalCustomers = customers.length;

    const totalAdmins = customers.filter((customer) =>
        normalizeRole(customer.role) === "ADMIN"
    ).length;

    const totalUsers = customers.filter((customer) =>
        normalizeRole(customer.role) === "USER"
    ).length;

    const advertisingCustomers = customers.filter(
        (customer) => customer.advertising
    ).length;

    const filteredCustomers = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        return customers
            .filter((customer) => {
                const matchesSearch =
                    customer.name.toLowerCase().includes(normalizedSearch) ||
                    customer.email.toLowerCase().includes(normalizedSearch);

                const matchesRole =
                    roleFilter === "ALL" || normalizeRole(customer.role) === roleFilter;

                const matchesAdvertising =
                    !advertisingOnly || customer.advertising;

                return matchesSearch && matchesRole && matchesAdvertising;
            })
            .sort((a, b) => {
                const direction = sortDirection === "asc" ? 1 : -1;

                if (sortField === "age") {
                    return (a.age - b.age) * direction;
                }

                if (sortField === "registrationDate") {
                    return (
                        (new Date(a.registrationDate).getTime() -
                            new Date(b.registrationDate).getTime()) *
                        direction
                    );
                }

                return String(a[sortField]).localeCompare(String(b[sortField])) * direction;
            });
    }, [customers, searchTerm, roleFilter, advertisingOnly, sortField, sortDirection]);

    function handleSort(field: SortField) {
        if (sortField === field) {
            setSortDirection((currentDirection) =>
                currentDirection === "asc" ? "desc" : "asc"
            );
            return;
        }

        setSortField(field);
        setSortDirection("asc");
    }

    async function handleDelete(customerId: number) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer? Their orders will also be deleted."
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteCustomer(customerId);
            setCustomers((currentCustomers) =>
                currentCustomers.filter((customer) => customer.id !== customerId)
            );
        } catch (error) {
            console.error(error);
            setError("We couldn't delete this customer.");
        }
    }

    return (
        <main className="protected-page">
            <section className="protected-card">
                <div className="protected-card__eyebrow">Admin dashboard</div>
                <h1>Customer insights</h1>
                <p>
                    Explore customers, filter by role, search by name or email, and manage
                    customer accounts.
                </p>
            </section>

            {loading && <p className="dashboard-message">Loading customers...</p>}

            {error && (
                <p className="dashboard-message dashboard-message--error">{error}</p>
            )}

            {!loading && !error && customers.length === 0 && (
                <section className="dashboard-empty">
                    <div className="dashboard-empty__icon">👥</div>
                    <h2>No customers found</h2>
                    <p>Customer data will appear here once users register.</p>
                </section>
            )}

            {!loading && !error && customers.length > 0 && (
                <>
                    <section className="dashboard-summary">
                        <article>
                            <span>Total customers</span>
                            <strong>{totalCustomers}</strong>
                        </article>

                        <article>
                            <span>Users</span>
                            <strong>{totalUsers}</strong>
                        </article>

                        <article>
                            <span>Admins</span>
                            <strong>{totalAdmins}</strong>
                        </article>

                        <article>
                            <span>Newsletter subscribers</span>
                            <strong>{advertisingCustomers}</strong>
                        </article>
                    </section>

                    <section className="dashboard-controls">
                        <div className="dashboard-control">
                            <label htmlFor="searchTerm">Search</label>
                            <input
                                id="searchTerm"
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search by name or email..."
                            />
                        </div>

                        <div className="dashboard-control">
                            <label htmlFor="roleFilter">Role</label>
                            <select
                                id="roleFilter"
                                value={roleFilter}
                                onChange={(event) =>
                                    setRoleFilter(event.target.value as RoleFilter)
                                }
                            >
                                <option value="ALL">All roles</option>
                                <option value="USER">Users</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                        </div>

                        <label className="dashboard-checkbox" htmlFor="advertisingOnly">
                            <input
                                id="advertisingOnly"
                                type="checkbox"
                                checked={advertisingOnly}
                                onChange={(event) => setAdvertisingOnly(event.target.checked)}
                            />
                            <span>Newsletter subscribers only</span>
                        </label>
                    </section>

                    {filteredCustomers.length === 0 ? (
                        <section className="dashboard-empty">
                            <div className="dashboard-empty__icon">🔎</div>
                            <h2>No matching customers</h2>
                            <p>Try changing your search or filters.</p>
                        </section>
                    ) : (
                        <section className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <button type="button" onClick={() => handleSort("name")}>
                                                Name {getSortIcon(sortField, sortDirection, "name")}
                                            </button>
                                        </th>
                                        <th>
                                            <button type="button" onClick={() => handleSort("email")}>
                                                Email {getSortIcon(sortField, sortDirection, "email")}
                                            </button>
                                        </th>
                                        <th>Role</th>
                                        <th>
                                            <button type="button" onClick={() => handleSort("age")}>
                                                Age {getSortIcon(sortField, sortDirection, "age")}
                                            </button>
                                        </th>
                                        <th>
                                            <button
                                                type="button"
                                                onClick={() => handleSort("registrationDate")}
                                            >
                                                Registered{" "}
                                                {getSortIcon(
                                                    sortField,
                                                    sortDirection,
                                                    "registrationDate"
                                                )}
                                            </button>
                                        </th>
                                        <th>Marketing</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>{customer.name}</td>
                                            <td>{customer.email}</td>
                                            <td>
                                                <span className="dashboard-role">
                                                    {normalizeRole(customer.role)}
                                                </span>
                                            </td>
                                            <td>{customer.age}</td>
                                            <td>{customer.registrationDate}</td>
                                            <td>{customer.advertising ? "Yes" : "No"}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="dashboard-delete-button"
                                                    onClick={() => handleDelete(customer.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </>
            )}
        </main>
    );
}

function normalizeRole(role: string): "USER" | "ADMIN" {
    return role.replace("ROLE_", "") === "ADMIN" ? "ADMIN" : "USER";
}

function getSortIcon(
    currentField: SortField,
    direction: SortDirection,
    field: SortField
): string {
    if (currentField !== field) {
        return "↕";
    }

    return direction === "asc" ? "↑" : "↓";
}