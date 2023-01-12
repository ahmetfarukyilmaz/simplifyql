import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import logo from "static/logo.png";
import request from "utils/request";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // make the form and image side by side
    display: "flex",
    maxHeight: "100vh",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export function RegisterPage() {
  if (localStorage.getItem("token")) {
    window.location.href = "/canvas";
  }

  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await request.post("/users/register", values);
      const token = response.data.auth_token;
      const email = response.data.email;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      window.location.href = "/canvas";
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.response.data.detail || "Something went wrong",
        color: "red",
      });
    }
    setLoading(false);
  };

  return (
    <div className={classes.wrapper}>
      <LoadingOverlay visible={loading} />
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Register to SimplifyQL
        </Title>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            required
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            error={form.errors.email && "Invalid email"}
          />
          <PasswordInput
            required
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Register
          </Button>
        </form>

        <Text align="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} to="/login">
            Login
          </Anchor>
        </Text>
      </Paper>
      <img
        style={{
          width: "75%",
          objectFit: "contain",
        }}
        src={logo}
        alt="Login Page"
      />
    </div>
  );
}
