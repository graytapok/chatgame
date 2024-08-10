import Navbar from "./Navbar";
import Footer from "./Footer";
import Main from "./Main";

function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[1fr_auto] relative">
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
}

export default AppLayout;
