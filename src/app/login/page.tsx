import AuthForm from "@/components/AuthForm";
export const metadata = { title: "Sign in" };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <AuthForm mode="login" next={(await searchParams).next} />;
}
