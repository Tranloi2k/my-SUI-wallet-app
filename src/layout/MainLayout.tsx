import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-[80%] max-w-[600px] mt-4 mx-auto border-blue-500 bg-white p-6 rounded-lg shadow-md gap-4">
      {children}
    </div>
  );
};

export default MainLayout;
