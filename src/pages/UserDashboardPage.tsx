import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../services/orderService";
import type { OrderOutDto } from "../types/order.types";
import "./UserDashboardPage.css";

type SortField = "orderDate" | "totalPrice" | "productName";
type SortDirection = "asc" | "desc";

export default function UserDashboardPage() {
    const { customerId, email } = useAuth();

    const [orders, setOrders] = useState<OrderOutDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("");
    const [sortField, setSortField] = useState<SortField>("orderDate");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getOrders();

                const userOrders = data.filter(
                    (order) => order.customer?.id === customerId
                );

                setOrders(userOrders);
            } catch (error) {
                console.error(error);
                setError("We couldn't load your dashboard data.");
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, [customerId]);

    const totalOrders = orders.length;

    const totalSpent = orders.reduce(
        (total, order) => total + order.totalPrice,
        0
    );

    const averageOrder =
        totalOrders > 0 ? totalSpent / totalOrders : 0;

    const lastOrderDate = orders.length
        ? [...orders].sort(
            (a, b) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )[0].orderDate
        : "-";

    const filteredOrders = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        return orders
            .filter((order) => {
                const productName = order.item?.name?.toLowerCase() || "";
                const productDescription = order.item?.description?.toLowerCase() || "";

                const matchesSearch =
                    productName.includes(normalizedSearch) ||
                    productDescription.includes(normalizedSearch);

                const matchesDate = !dateFilter || order.orderDate === dateFilter;

                return matchesSearch && matchesDate;
            })
            .sort((a, b) => {
                const direction = sortDirection === "asc" ? 1 : -1;

                if (sortField === "totalPrice") {
                    return (a.totalPrice - b.totalPrice) * direction;
                }

                if (sortField === "orderDate") {
                    return (
                        (new Date(a.orderDate).getTime() -
                            new Date(b.orderDate).getTime()) *
                        direction
                    );
                }

                return (
                    (a.item?.name || "").localeCompare(b.item?.name || "") * direction
                );
            });
    }, [orders, searchTerm, dateFilter, sortField, sortDirection]);

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

    return (
        <main className="user-dashboard">
            <div className="user-dashboard-floating user-dashboard-floating--one">📊</div>
            <div className="user-dashboard-floating user-dashboard-floating--two">🧮</div>
            <div className="user-dashboard-floating user-dashboard-floating--three">📈</div>
            <div className="user-dashboard-floating user-dashboard-floating--four">🧾</div>
            
            <section className="user-dashboard__header">
                <span className="user-dashboard__eyebrow">Order stats</span>
                <h1>My Cozy Bites stats</h1>
                <p>
                    Track your orders, explore your spending and filter your healthy
                    choices.
                </p>
                <p className="user-dashboard__email">Signed in as: {email}</p>
            </section>

            {loading && (
                <p className="user-dashboard__message">Loading dashboard...</p>
            )}

            {error && (
                <p className="user-dashboard__message user-dashboard__message--error">
                    {error}
                </p>
            )}

            {!loading && !error && orders.length === 0 && (
                <section className="user-dashboard__empty">
                    <div className="user-dashboard__empty-icon">🧾</div>
                    <h2>No orders yet</h2>
                    <p>Your dashboard will show activity once you place your first order.</p>
                </section>
            )}

            {!loading && !error && orders.length > 0 && (
                <>
                    <section className="user-dashboard__summary">
                        <article>
                            <span>Total orders</span>
                            <strong>{totalOrders}</strong>
                        </article>

                        <article>
                            <span>Total spent</span>
                            <strong>{totalSpent.toFixed(2)} €</strong>
                        </article>

                        <article>
                            <span>Average order</span>
                            <strong>{averageOrder.toFixed(2)} €</strong>
                        </article>

                        <article>
                            <span>Last order</span>
                            <strong>{lastOrderDate}</strong>
                        </article>
                    </section>

                    <section className="user-dashboard__controls">
                        <div className="user-dashboard__control">
                            <label htmlFor="orderSearch">Search</label>
                            <input
                                id="orderSearch"
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search by product..."
                            />
                        </div>

                        <div className="user-dashboard__control">
                            <label htmlFor="dateFilter">Order date</label>
                            <input
                                id="dateFilter"
                                type="date"
                                value={dateFilter}
                                onChange={(event) => setDateFilter(event.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="user-dashboard__clear"
                            onClick={() => {
                                setSearchTerm("");
                                setDateFilter("");
                            }}
                        >
                            Clear filters
                        </button>
                    </section>

                    {filteredOrders.length === 0 ? (
                        <section className="user-dashboard__empty">
                            <div className="user-dashboard__empty-icon">🔎</div>
                            <h2>No matching orders</h2>
                            <p>Try changing your search or selected date.</p>
                        </section>
                    ) : (
                        <section className="user-dashboard__table-wrapper">
                            <table className="user-dashboard__table">
                                <thead>
                                    <tr>
                                        <th>
                                            <button
                                                type="button"
                                                onClick={() => handleSort("productName")}
                                            >
                                                Product{" "}
                                                {getSortIcon(sortField, sortDirection, "productName")}
                                            </button>
                                        </th>
                                        <th>
                                            <button
                                                type="button"
                                                onClick={() => handleSort("orderDate")}
                                            >
                                                Date {getSortIcon(sortField, sortDirection, "orderDate")}
                                            </button>
                                        </th>
                                        <th>
                                            <button
                                                type="button"
                                                onClick={() => handleSort("totalPrice")}
                                            >
                                                Total{" "}
                                                {getSortIcon(sortField, sortDirection, "totalPrice")}
                                            </button>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <strong>{order.item?.name}</strong>
                                                <span>{order.item?.description}</span>
                                            </td>
                                            <td>{order.orderDate}</td>
                                            <td className="user-dashboard__price">
                                                {order.totalPrice.toFixed(2)} €
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