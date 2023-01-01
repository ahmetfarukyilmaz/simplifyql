import { useState } from "react";

import {
  Header as MantineHeader,
  Group,
  Avatar,
  Menu,
  UnstyledButton,
  Text,
  createStyles,
} from "@mantine/core";
import { IconChevronDown, IconLogout } from "@tabler/icons";

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
}));

export default function Header() {
  const { classes, cx } = useStyles();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const onLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <MantineHeader height={80} p="xs">
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <div>SimplifyQL</div>
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
                  John Doe
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
      </Group>
    </MantineHeader>
  );
}
