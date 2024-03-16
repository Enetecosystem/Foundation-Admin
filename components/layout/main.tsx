"use client";

import { Code } from "@/components/typography/code";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";

// import { FakeParagraphs } from "@/components/helpers/FakeParagraphs";
// import { FakeWordList } from "@/components/helpers/FakeWordList";
import { StickyFooter } from "@/components/layout/sticky-footer";
// import { Paragraph } from "@/components/layout/paragraph";
import { ResponsiveSidebarButton } from "@/components/layout/responsive-sidebar-button";
import { StickyHeader } from "@/components/layout/sticky-header";
import { StickySidebar } from "@/components/layout/sticky-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  useMutationWithAuth,
  useQueryWithAuth,
  useSessionId,
  useSignOut,
  useSignUpSignIn,
} from "@convex-dev/convex-lucia-auth/react";
import { useMutation } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionId = useSessionId();

  return (
    <main className="flex flex-col gap-8">
      {/* <h1 className="my-8 text-center text-4xl font-extrabold">
        Enet Admin Dashboard
      </h1> */}
      {sessionId ? <SignedIn>{children}</SignedIn> : <AuthForm />}
    </main>
  );
}

function SignedIn({ children }: { children: React.ReactNode }) {
  const data = useQueryWithAuth(api.queries.dashboardData, {});
  const menus: string[] = ["Users", "Tasks", "Events", "Ad Space"];
  const sidebar = (
    <nav className={"grid items-center space-y-4 lg:space-y-6"}>
      {menus.map((menu, i) => (
        <Link
          key={i}
          href={`/${menu.toLowerCase().split(" ").join("-")}`}
          className="hover:text-primary text-sm font-medium transition-colors"
        >
          {menu}
        </Link>
      ))}
    </nav>
  );
  return (
    <>
      <StickyHeader className="container flex h-[3.25rem] grid-cols-[240px_minmax(0,1fr)] items-center justify-between p-2 sm:grid">
        <div></div>
        <div className="container">
          <SignOutButton />
        </div>

        <ResponsiveSidebarButton className="sm:hidden">
          <div className="bg-background fixed top-[calc(3.25rem+1px)] h-[calc(100vh-(3.25rem+1px))] w-screen sm:hidden">
            <ScrollArea className="h-full">{sidebar}</ScrollArea>
          </div>
        </ResponsiveSidebarButton>
      </StickyHeader>
      <div className="container grid-cols-[240px_minmax(0,1fr)] sm:grid">
        <StickySidebar className="top-[calc(3.25rem+1px)] hidden h-[calc(100vh-(3.25rem+1px))] sm:block">
          {sidebar}
        </StickySidebar>
        <main className="min-h-[calc(100vh-(3.25rem+1px))]">
          {/* <Paragraph>Main content</Paragraph> */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Mined
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="text-muted-foreground h-4 w-4"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $EN{" "}
                  {data ? data.totalMined.toLocaleString("en-US") : "45,231.89"}
                </div>
                <p className="text-muted-foreground text-xs">
                  Total $EN token mined
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="text-muted-foreground h-4 w-4"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data ? data.totalReferrals.toLocaleString("en-US") : "2350"}
                </div>
                <p className="text-muted-foreground text-xs">
                  All time referrals
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP Earned</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="text-muted-foreground h-4 w-4"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data ? data.totalXp.toLocaleString("en-US") : "12,234"}
                </div>
                <p className="text-muted-foreground text-xs">Total XP earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="text-muted-foreground h-4 w-4"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data ? data.totalUsers.toLocaleString("en-US") : "573"}
                </div>
                <p className="text-muted-foreground text-xs">
                  Total users onboarded
                </p>
              </CardContent>
            </Card>
          </div>
          {children}
        </main>
      </div>
      <StickyFooter>Enet admin</StickyFooter>
    </>
  );
}

function SignOutButton() {
  const signOut = useSignOut();
  return <Button onClick={signOut}>Sign out</Button>;
}

function AuthForm() {
  const { flow, toggleFlow, error, onSubmit } = useSignUpSignIn({
    signIn: useMutationWithAuth(api.auth.signIn),
    signUp: useMutationWithAuth(api.auth.signUp),
  });
  console.log(error);

  return (
    <div className="flex flex-col items-center gap-4 px-20">
      <form
        className="flex w-[18rem] flex-col"
        onSubmit={(event) => {
          void onSubmit(event);
        }}
      >
        <label htmlFor="email">Email</label>
        <Input name="email" type="email" id="email" className="mb-4" />
        <label htmlFor="password">Password</label>
        <Input
          type="password"
          name="password"
          id="password"
          className="mb-4 "
        />
        <Button type="submit">
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </Button>
      </form>
      <Button variant="link" onClick={toggleFlow}>
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
      <div className="text-sm font-medium text-red-500">
        {error !== undefined
          ? flow === "signIn"
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?"
          : null}
      </div>
    </div>
  );
}