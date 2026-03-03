import NavClient from "@/components/client/Navigasi";

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavClient />
      {children}
    </div>
  );
};

export default LayoutClient;
