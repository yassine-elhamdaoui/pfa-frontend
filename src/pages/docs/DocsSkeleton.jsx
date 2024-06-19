import { Box, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";

function DocsSkeleton() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: windowWidth < 900 ? "calc(100% + 10px)" : "65%",
          minHeight: "calc(100svh - 100px)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "0 10px 0 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "-17px",
          }}
        >
          <BreadCrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Docs", href: "/docs" },
            ]}
          />
        </Box>
        <Skeleton
          variant="rectangular"
          width={100}
          height={23}
          sx={{ borderRadius: "30px" }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflowX: "hidden",
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              variant="rectangular"

              sx={{
                padding: "10px",
                borderRadius: "10px",
                minWidth: "200px",
                cursor: "pointer",
                height: "130px",
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        ></Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "100%",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={100}
              height={23}
              sx={{ borderRadius: "30px" }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <Skeleton
                variant="rectangular"
                height={55}
                sx={{ borderRadius: "5px 5px 0px 0px" }}
              />
              <Skeleton variant="rectangular" height={55} />
              <Skeleton variant="rectangular" height={55} />
              <Skeleton
                variant="rectangular"
                height={55}
                sx={{ borderRadius: "0px 0px 5px 5px" }}
              />
            </div>
          </div>
        </Box>
        <Box
          sx={{
            position: windowWidth < 900 ? "absolute" : "relative",
            width: windowWidth < 900 ? "100%" : "35%",
          }}
        >
          <Skeleton variant="rectangular" height="100%" width="100%" />
        </Box>
      </Box>
      <Skeleton variant="rectangular" height="calc(100svh - 100px)" width="35%" sx={{borderRadius:"10px"}}/>
    </Box>
  );
}

export default DocsSkeleton