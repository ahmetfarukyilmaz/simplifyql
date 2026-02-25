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
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #dee2e6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    textDecoration: "none",
  },
  navLink: {
    textDecoration: "none",
    color: theme.black,
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
    <MantineHeader sx={{ display: "flex", alignItems: "center" }} height={80} p="md">
      <h2 style={{ display: "flex", alignItems: "center", width: "100%", paddingLeft: 30 }}>
        SimplifyQL
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", paddingRight: 30, gap: 20 }}>
        <Link className={classes.navLink} to="/er-diagrams">My ER Diagrams</Link>
        <Link className={classes.navLink} to="/canvas">ER Diagram Builder</Link>
        <a
          className={classes.githubLogo}
          href="https://github.com/ahmetfarukyilmaz/simplifyql"
          target="_blank"
          rel="noreferrer"
        >
          <img src={github_logo} style={{ height: 30, width: 30 }} alt="GitHub" />
        </a>

        <Menu
          width={200}
          transition="pop-top-right"
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
        >
          <Menu.Target>
            <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
              <Group spacing={7}>
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                  {email}
                </Text>
                <IconChevronDown size={12} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={onLogout} icon={<IconLogout size={14} stroke={1.5} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </MantineHeader>
  );
}
