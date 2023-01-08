import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Header as MantineHeader,
  Group,
  Menu,
  UnstyledButton,
  Text,
  createStyles,
} from "@mantine/core";
import { IconChevronDown, IconLogout } from "@tabler/icons";
import github_logo from "static/github_logo.svg";

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
  githubLogo: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#495057",
    backgroundColor: "#fff",
    textSizeAdjust: "100%",
    colorScheme: "light",
    lineHeight: "1.55",
    WebkitFontSmoothing: "antialiased",
    background: "transparent",
    WebkitBoxFlex: "0",
    flexGrow: "0",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
    cursor: "pointer",
    padding: "0",
    appearance: "none",
    fontSize: "16px",
    textAlign: "left",
    textDecoration: "none",
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
  },
}));

export default function Header() {
  const email = localStorage.getItem("email");
  const { classes, cx } = useStyles();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const onLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <MantineHeader
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      height={80}
      p="md"
    >
      <h3
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          paddingLeft: "30px",
        }}
      >
        SimplifyQL
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "30px",
        }}
      >
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to="/er-diagrams"
        >
          My ER Diagrams
        </Link>
        <Link style={{ textDecoration: "none", color: "black" }} to="/canvas">
          ER Diagram Builder
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          paddingRight: "30px",
          gap: "30px",
        }}
      >
        <a
          className={classes.githubLogo}
          href="https://github.com/ahmetfarukyilmaz/simplifyql"
          target="_blank"
        >
          <img
            src={github_logo}
            style={{ height: "30px", width: "30px" }}
            alt="github logo"
          />
        </a>

        <Menu
          width={200}
          transition="pop-top-right"
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
        >
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, {
                [classes.userActive]: userMenuOpened,
              })}
            >
              <Group spacing={7}>
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                  {email}
                </Text>
                <IconChevronDown size={12} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={onLogout}
              icon={<IconLogout size={14} stroke={1.5} />}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </MantineHeader>
  );
}
