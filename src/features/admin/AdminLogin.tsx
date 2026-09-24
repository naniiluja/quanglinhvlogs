import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signIn } from '@/services/admin'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useMutation({ mutationFn: () => signIn(email, password), retry: false })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    login.mutate()
  }

  return (
    <Card className="mx-auto w-full max-w-sm bg-cream/80">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Đăng nhập quản trị</CardTitle>
        <CardDescription>Dành cho người quản lý danh sách khách mời.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="admin-email">Email</FieldLabel>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field data-invalid={login.isError}>
              <FieldLabel htmlFor="admin-password">Mật khẩu</FieldLabel>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={login.isError}
              />
              {/* Một thông báo chung, không nói rõ sai email hay sai mật khẩu. */}
              {login.isError && (
                <FieldError>
                  {login.error.code === 'UNAUTHORIZED'
                    ? 'Email hoặc mật khẩu không đúng.'
                    : login.error.message}
                </FieldError>
              )}
            </Field>
            <Button type="submit" className="h-11" disabled={login.isPending}>
              {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
