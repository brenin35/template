import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { user as userController } from '$db/controller'

export const load = (async ({ locals }) => {
  const { user } = locals

  if (!user) {
    return redirect(302, '/login')
  }

  const user_sessions = await  userController.getSessions(user.id)
  return {  user_sessions }
}) satisfies PageServerLoad
