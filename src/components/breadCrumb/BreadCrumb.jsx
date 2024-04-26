/* eslint-disable react/prop-types */
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

function handleClick(event) {
  event.preventDefault();
  console.log("You clicked a breadcrumb.");
}

export default function BreadCrumb({ items }) {
  console.log(items);
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => (
          <StyledBreadcrumb
            key={index}
            component={index === 0 ? "a" : undefined} // Set component to "a" for the first breadcrumb
            href={index === 0 ? "/" : item.href} // Set href to "/" for the first breadcrumb
            label={item.label}
            icon={index === 0 && item.label === "Home"? <HomeIcon fontSize="small" /> : null}
          />
        ))}
      </Breadcrumbs>
    </div>
  );
}
