import { Skeleton } from "@mui/material";
import BreadCrumb from "../../components/breadCrumb/BreadCrumb";

function DefenseSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BreadCrumb
          items={[
            { label: "Home", path: "/" },
            { label: "dashboard", path: "" },
            { label: "Presentations", path: "" },
          ]}
        />
        <Skeleton variant="rectangular" width={100} height={40} />
      </div>
      <div>
        <Skeleton sx={{marginBottom:"1px"}} variant="rectangular" height={45} width="100%" />
        <Skeleton variant="rectangular" height="calc(100svh - 200px)" width="100%" />
      </div>
    </div>
  );
}

export default DefenseSkeleton