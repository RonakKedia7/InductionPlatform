
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: string;
  name: string;
  email: string;
};

type Application = {
  name: string;
  email: string;
  department: string;
  year: number;
  preferredTeam: string;
  reason: string;
  status: "Pending" | "Accepted" | "Rejected";
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is logged in
        const userRes = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!userRes.ok) {
          setUser(null);
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user);

        // Check if user has already applied
        const applicationRes = await fetch(
          `${API_URL}/applications/me`,
          {
            credentials: "include",
          }
        );

        if (applicationRes.ok) {
          const applicationData = await applicationRes.json();
          setApplication(applicationData.application);
        } else if (applicationRes.status !== 404) {
          setError("Could not fetch your application details.");
        }
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        setError("Logout failed. Please try again.");
        return;
      }

      setUser(null);
      setApplication(null);
      setError("");
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const statusStyle = {
    Pending: "bg-gray-100 text-gray-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-5 md:px-16">
        <Link href="/" className="text-xl font-bold">
          WebWiz
        </Link>

        {loading ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:block">
              Hi, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium underline underline-offset-4 hover:text-gray-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium underline underline-offset-4 hover:text-gray-500"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Recruitment 2026
        </p>

        {loading ? (
          <h2 className="text-4xl font-bold">Loading...</h2>
        ) : user ? (
          <>
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Welcome, {user.name}.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
              Welcome to WebWiz recruitment. Check your application status
              or complete your induction application below.
            </p>

            {!application ? (
              <Link
                href="/apply"
                className="mt-9 inline-block rounded-md bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Apply Now
              </Link>
            ) : (
              <div className="mt-9">
                <p className="text-sm text-gray-600">
                  You have already submitted your application.
                </p>
                <span
                  className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold ${statusStyle[application.status]}`}
                >
                  {application.status}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Be a part of something bigger.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Join our club, meet like-minded people, learn new skills,
              and work together on exciting projects. Applications for
              the new induction cycle are now open.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-md bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Create an Account
              </Link>

              <Link
                href="/login"
                className="rounded-md border border-black px-8 py-3 text-sm font-semibold hover:bg-gray-100"
              >
                Already registered? Login
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Application Details */}
      {user && application && (
        <section className="border-t border-gray-200 px-6 py-12 md:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold">Your Application</h2>
            <p className="mt-2 text-sm text-gray-600">
              Here are the details you submitted during induction.
            </p>

            <div className="mt-8 space-y-5 rounded-lg border border-gray-200 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="mt-1 font-medium">{application.name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="mt-1 font-medium">{application.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="mt-1 font-medium">{application.department}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Year of Study</p>
                  <p className="mt-1 font-medium">
                    {application.year}
                    {application.year === 1
                      ? "st"
                      : application.year === 2
                        ? "nd"
                        : application.year === 3
                          ? "rd"
                          : "th"}{" "}
                    Year
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Preferred Team</p>
                  <p className="mt-1 font-medium">
                    {application.preferredTeam}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <p className="text-xs text-gray-500">Reason for Joining</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {application.reason}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <p className="mx-auto max-w-3xl px-6 pb-6 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Induction Details */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 md:px-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold">Induction Details</h2>
          <p className="mt-2 text-gray-600">
            Everything you need to know before applying.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold">Who Can Apply?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                All interested students who are enthusiastic about learning,
                contributing, and being part of our community.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold">Application Process</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Create an account, log in, and complete the induction
                application form with your details and preferred team.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold">Teams</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore different teams, understand their work, and select
                the team that best matches your interests.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold">Important Note</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Each student can submit only one application. Make sure your
                information is correct before submitting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-6 text-center text-sm text-gray-500">
        © 2026 WebWiz. All rights reserved.
      </footer>
    </main>
  );
}
