
import React from "react";
import Navbar from "../components/Navbar";

function Marketplace() {
    return (
        <>
            {/* Main KrishiDoot Navigation */}
            <Navbar />

            {/* Existing Smart Mandi Website */}
            <main
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    background: "#fff",
                }}
            >
                <iframe
                    src="/marketplace.html"
                    title="KrishiDoot Smart Mandi"
                    style={{
                        display: "block",
                        width: "100%",
                        height: "calc(100vh - 75px)",
                        minHeight: "700px",
                        border: "none",
                    }}
                />
            </main>
        </>
    );
}

export default Marketplace;
