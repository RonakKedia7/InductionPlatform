"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ApplyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    preferredTeam: "",
    reason: "",
  });

  // Check authentication and previous application
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userRes = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!userRes.ok) {
          router.replace("/login");
          return;
        }

        const userData = await userRes.json();

        setForm((prev) => ({
          ...prev,
          name: userData.user.name,
          email: userData.user.email,
        }));

        const applicationRes = await fetch(
          `${API_URL}/applications/me`,
          {
            credentials: "include",
          }
        );

        const applicationData = await applicationRes.json();

        if (applicationRes.status === 200 && applicationData.application) {
          setSubmitted(true);
        } else if (applicationRes.status === 404) {
          setSubmitted(false);
        } else {
          throw new Error("Could not check your application status.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Application submission failed.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-black text-2xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Application Submitted
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Thank you for applying! Your application has been received.
            The club team will review it and contact you regarding the
            next steps.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-md bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Recruitment 2026
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Club Induction Application
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Fill in the details below to apply for club induction.
            Please ensure all information is correct.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science and Engineering"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Year of Study
            </label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">Select your year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Preferred Team
            </label>
            <select
              name="preferredTeam"
              value={form.preferredTeam}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              <option value="">Select a team</option>
              <option value="Technical">Technical</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Content">Content</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Why do you want to join this club?
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Tell us about your interests and what you can contribute..."
              rows={5}
              maxLength={1000}
              required
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              {form.reason.length}/1000
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-center text-xs text-gray-500">
            You can submit only one application.
          </p>
        </form>
      </div>
    </main>
  );
}
