<script lang="ts">
  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'

  import type { PageData } from './$types'
  import { getUserContext } from '$lib/stores/user'

  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'
  const user = getUserContext()

  export let data: PageData

  const sessions = data.user_sessions
</script>

<SEO
  {...getSEOProps({
    title: 'My Profile',
    description: 'Edit your profile',
  })}
/>

<div
  class="mx-auto w-full max-w-md rounded-lg border border-primary bg-base-200 shadow-sm"
>
  <div class="flex flex-col space-y-1.5 p-6">
    <h3
      class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
    >
      Edit Profile
    </h3>
    <div class="space-y-6 p-6">
      <div class="flex flex-col items-center gap-4">
        <span
          class="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full"
        >
          <img
            class="aspect-square h-full w-full"
            src="https://generated.vusercontent.net/placeholder-user.jpg"
          />
        </span>
        <p>
          {$user?.username}
        </p>
        <p>
          {$user?.email}
        </p>
        <p>
          {$user?.email_verified ? 'verified' : 'not verified'}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <h1>Sessions:</h1>

        {#each sessions as s}
          <div class="rounded bg-base-300 p-1">
            <p>
              id: {s.id}
            </p>
            <p>
              expiration: {new Date(s.expiresAt)}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
