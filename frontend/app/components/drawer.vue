<template>
    <div class="drawer drawer-end">
        <input id="right-drawer-toggle" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- Page content here -->
            <label
                for="right-drawer-toggle"
                class="drawer-button btn btn-primary rounded-r-none fixed top-1/2 right-0"
            >
                Open drawer
            </label>
        </div>
        <div class="drawer-side z-40">
            <label for="right-drawer-toggle" class="drawer-overlay"></label>
            <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <h2 class="text-xl font-bold mb-4">Right Drawer</h2>
                <p>This is your drawer content!</p>
                <button class="btn mt-4" @click="closeDrawer">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const closeDrawer = () => {
        const checkbox = document.getElementById('right-drawer-toggle')
        if (checkbox) checkbox.checked = false
    }
</script>