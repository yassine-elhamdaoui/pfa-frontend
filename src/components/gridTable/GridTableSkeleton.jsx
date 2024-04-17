import { Skeleton } from "@mui/material";

// eslint-disable-next-line react/prop-types
export default function GridTableSkeleton({mode}) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          marginTop: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          height={25}
          sx={{ borderRadius: "20px" }}
          width={130}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ borderRadius: "4px" }}
          width={130}
          animation="wave"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            overflowX: "auto",
            minWidth: "100%",
            WebkitOverflowScrolling: "touch",
            borderRadius: "5px 5px 0 0",
            scrollbarWidth: "none",
            backgroundColor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.14)"
                : "rgba(0, 0, 0, 0.13)",
            height: "50px",
          }}
        >
          {[...Array(20)].map((_, index) => (
            <div key={index}>
              <Skeleton
                variant="rectangular"
                height={30}
                sx={{ borderRadius: "20px" }}
                width={150}
                animation={index % 2 === 0 ? "wave" : "wave-reverse"} // Alternate between "wave" and "wave-reverse"
              />
            </div>
          ))}
        </div>
        {[...Array(Math.floor((window.innerHeight - 300) / 45))].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={45}
            animation={index % 2 === 0 ? "wave" : "wave-reverse"} // Alternate between "wave" and "wave-reverse"
          />
        ))}
        <Skeleton
          variant="rectangular"
          height={45}
          sx={{ borderRadius: "0 0 5px 5px" }}
          animation="wave" // Alternate between "wave" and "wave-reverse"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{ borderRadius: "20px", marginBottom: "20px" }}
          width={100}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          height={30}
          sx={{ borderRadius: "20px", marginBottom: "20px" }}
          width={30}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          height={30}
          sx={{ borderRadius: "20px", marginBottom: "20px" }}
          width={30}
          animation="wave"
        />
      </div>
    </div>
  );
}
