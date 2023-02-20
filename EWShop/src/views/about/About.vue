<template>
    <div>
        <nav-bar>
            <template v-slot:default>关于我们</template>
        </nav-bar>

        <div class="about">
            <img src="~assets/images/about.jpg" alt="">
        </div>

    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {
    name: "About",
    components: {
        NavBar,
    }
}
</script>

<style scoped lang="scss">
.about {
    margin-top: 45px;
}
</style>