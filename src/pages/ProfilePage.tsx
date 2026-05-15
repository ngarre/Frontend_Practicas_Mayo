import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    deleteMyProfile,
    getMyProfile,
    updateMyProfile,
} from "../services/customerService";
import { uploadImageToCloudinary } from "../services/cloudinaryService.ts";
import type { Customer, CustomerProfileUpdateDto } from "../types/customer.types";
import "./ProfilePage.css";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [profile, setProfile] = useState<Customer | null>(null);

    const [formData, setFormData] = useState<CustomerProfileUpdateDto>({
        name: "",
        phone: "",
        age: 18,
        advertising: false,
        profileImageUrl: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [deletingAccount, setDeletingAccount] = useState<boolean>(false);

    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getMyProfile();

                setProfile(data);

                setFormData({
                    name: data.name,
                    phone: data.phone || "",
                    age: data.age,
                    advertising: data.advertising,
                    profileImageUrl: data.profileImageUrl || "",
                });
            } catch (error) {
                console.error(error);
                setError("We couldn't load your profile.");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "age"
                        ? Number(value)
                        : value,
        });
    }

    async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccessMessage("");
        setUploadingImage(true);

        try {
            const imageUrl = await uploadImageToCloudinary(file);

            setFormData({
                ...formData,
                profileImageUrl: imageUrl,
            });

            setSuccessMessage("Profile image uploaded. Remember to save changes.");
        } catch (error) {
            console.error(error);
            setError("We couldn't upload your profile image.");
        } finally {
            setUploadingImage(false);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setSuccessMessage("");
        setSaving(true);

        try {
            const updatedProfile = await updateMyProfile(formData);

            setProfile(updatedProfile);

            setFormData({
                name: updatedProfile.name,
                phone: updatedProfile.phone || "",
                age: updatedProfile.age,
                advertising: updatedProfile.advertising,
                profileImageUrl: updatedProfile.profileImageUrl || "",
            });

            setSuccessMessage("Profile updated successfully.");
        } catch (error) {
            console.error(error);
            setError("We couldn't update your profile.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteAccount() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This will also delete your orders."
        );

        if (!confirmDelete) {
            return;
        }

        setError("");
        setSuccessMessage("");
        setDeletingAccount(true);

        try {
            await deleteMyProfile();
            logout();
            navigate("/", { replace: true });
        } catch (error) {
            console.error(error);
            setError("We couldn't delete your account.");
        } finally {
            setDeletingAccount(false);
        }
    }

    function handleRemoveImage() {
        setFormData({
            ...formData,
            profileImageUrl: "",
        });

        setSuccessMessage("Profile image removed. Remember to save changes.");
        setError("");
    }

    if (loading) {
        return (
            <main className="profile-page">
                <p className="profile-message">Loading profile...</p>
            </main>
        );
    }

    if (error && !profile) {
        return (
            <main className="profile-page">
                <p className="profile-message profile-message--error">{error}</p>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-floating profile-floating--one">👤</div>
            <div className="profile-floating profile-floating--two">📸</div>
            <div className="profile-floating profile-floating--three">🪪</div>
            <div className="profile-floating profile-floating--four">⚙️</div>

            <section className="profile-header">
                <span className="profile-header__eyebrow">My profile</span>
                <h1>Manage your Cozy Bites account</h1>
                <p>
                    Update your personal details, choose your newsletter preferences and
                    upload a profile image using Cloudinary.
                </p>
            </section>

            <section className="profile-layout">
                <form className="profile-form" onSubmit={handleSubmit}>
                    <h2>Profile details</h2>

                    <div className="profile-form__field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="profile-form__field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={profile?.email || ""}
                            disabled
                        />
                    </div>

                    <div className="profile-form__field">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="600123123"
                        />
                    </div>

                    <div className="profile-form__field">
                        <label htmlFor="age">Age</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            min={1}
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label className="profile-form__checkbox" htmlFor="advertising">
                        <input
                            id="advertising"
                            name="advertising"
                            type="checkbox"
                            checked={formData.advertising}
                            onChange={handleChange}
                        />
                        <span>I want to receive news, healthy menus and cozy offers.</span>
                    </label>

                    <div className="profile-form__field">
                        <label htmlFor="profileImage">Profile image</label>

                        <div className="profile-form__image-row">
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            {formData.profileImageUrl && (
                                <button
                                    type="button"
                                    className="profile-form__remove-image"
                                    onClick={handleRemoveImage}
                                >
                                    Remove image
                                </button>
                            )}
                        </div>
                    </div>

                    {error && <p className="profile-message profile-message--error">{error}</p>}

                    {successMessage && (
                        <p className="profile-message profile-message--success">
                            {successMessage}
                        </p>
                    )}

                    <div className="profile-form__actions">
                        <button className="profile-form__button" type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save changes"}
                        </button>

                        <button
                            className="profile-form__delete"
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                        >
                            {deletingAccount ? "Deleting..." : "Delete account"}
                        </button>
                    </div>
                </form>

                <aside className="profile-preview">
                    <div className="profile-preview__image">
                        {formData.profileImageUrl ? (
                            <img src={formData.profileImageUrl} alt="Profile" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    <h2>{formData.name || "Your profile"}</h2>
                    <p>{profile?.email}</p>

                    {uploadingImage && <p>Uploading image...</p>}

                    <div className="profile-preview__badge">
                        {profile?.role?.toString().replace("ROLE_", "")}
                    </div>
                </aside>
            </section>
        </main>
    );
}