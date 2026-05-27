// This empty layout file is intentionally minimal.
// The sidebar conditional logic is handled in the parent /admin/layout.tsx
// by reading the x-pathname header injected by middleware.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
