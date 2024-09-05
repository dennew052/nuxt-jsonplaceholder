<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const currentPage = ref(1)
const postsPerPage = 10
const posts = ref([])

const fetchPosts = async () => {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage.value}&_limit=${postsPerPage}`)
    posts.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const totalPosts = ref(100) // JSONPlaceholder возвращает фиксированное количество постов
const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage))

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchPosts()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPosts()
  }
}

fetchPosts()
</script>

<template>
  <div>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
      </li>
    </ul>
    <div>
      <button @click="previousPage" :disabled="currentPage <= 1">Previous</button>
      <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
    </div>
  </div>
</template>
