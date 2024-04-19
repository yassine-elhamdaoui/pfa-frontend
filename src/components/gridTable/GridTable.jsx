import { DataGrid } from '@mui/x-data-grid';

// eslint-disable-next-line react/prop-types
function GridTable({ columns, rows, loading, mode}) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      loading={loading}
      componentsProps={{
        loadingOverlay: {
          style: {
            background: "transparent",
            backdropFilter: "blur(4px)",
          },
        },
      }}
      sx={{
        maxWidth: "100%",
        width: "fit-content",
        "& .custom-header": {
          backgroundColor:
            mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
        },
        "& .css-qvtrhg-MuiDataGrid-virtualScroller": {
          height: "100svh",
          "&::-webkit-scrollbar": {
            width: "5px",
            height: "5px", 
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888", 
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555", 
          },
        },
      }}
    />
  );
}

export default GridTable