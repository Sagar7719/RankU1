import Navbar from "../components/Navbar/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </>
  );
}

export default MainLayout;