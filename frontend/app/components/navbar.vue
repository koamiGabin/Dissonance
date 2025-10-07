<template>
    <div class="navbar bg-base-100 shadow-sm">
        <div class="flex-1">
            <NuxtLink to="/" class="btn btn-ghost font-press text-xl">Dissonance</NuxtLink>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
                <li><NuxtLink to="/jouer" class="btn btn-ghost text-l">Le Jeu</NuxtLink></li>
                <li><NuxtLink to="/regles" class="btn btn-ghost text-l">Les Règles</NuxtLink></li>
                <li><NuxtLink to="/lobby" class="btn btn-ghost text-l">Lobby</NuxtLink></li>
            </ul>
        </div>
    </div>
</template>
