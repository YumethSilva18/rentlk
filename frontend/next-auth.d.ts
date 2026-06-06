import 'next-auth'
import { User } from '@/types/user.types'

declare module 'next-auth' {
  interface Session {
    user: User & {
      accessToken?: string
    }
  }

  interface User extends User {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    user?: User
  }
}
