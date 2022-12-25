import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import { Link } from 'react-router-dom'
import request from 'utils/request'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 1200,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 1200,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

export function RegisterPage() {
  if (localStorage.getItem('token')) {
    window.location.href = '/'
  }

  const { classes } = useStyles()
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  })

  const onSubmit = async (values) => {
    try {
      const response = await request.post('/users/register', values)
      const token = response.data.auth_token
      localStorage.setItem('token', token)
      window.location.href = '/'
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response.data.detail || 'Something went wrong',
        color: 'red',
      })
    }
  }

  return (
    <div className={classes.wrapper}>
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
              form.setFieldValue('email', event.currentTarget.value)
            }
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            error={form.errors.email && 'Invalid email'}
          />
          <PasswordInput
            required
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Register
          </Button>
        </form>

        <Text align="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login">
            Login
          </Anchor>
        </Text>
      </Paper>
    </div>
  )
}
