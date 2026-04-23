import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {session.user.username}!</CardTitle>
            <CardDescription>
              Your current role is <strong className="font-bold text-primary">{session.user.role}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm font-medium">Account Details:</p>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                <li>ID: {session.user.id}</li>
                <li>Username: {session.user.username}</li>
                <li>Role: {session.user.role}</li>
              </ul>
            </div>

            {session.user.role === "ADMIN" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
                <h3 className="font-semibold text-red-800 dark:text-red-200">Admin Section</h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  You can see this because you have ADMIN privileges.
                </p>
                <div className="mt-4 flex gap-4">
                  <Button variant="destructive" size="sm">Manage Users</Button>
                  <Button variant="outline" size="sm">System Settings</Button>
                </div>
              </div>
            )}

            {session.user.role === "PEGAWAI" && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Pegawai Section</h3>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Welcome to the staff dashboard. Here you can manage your daily tasks.
                </p>
                <div className="mt-4 flex gap-4">
                  <Button variant="default" size="sm">View Stock</Button>
                  <Button variant="outline" size="sm">Create Report</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
