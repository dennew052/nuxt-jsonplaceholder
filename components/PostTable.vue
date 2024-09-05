<template>
  <div class="p-4">
    <!-- Контейнер с максимальной шириной и центрированием -->
    <div class="max-w-[1366px] mx-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 10%;">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 30%;">Title</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60%;">Body</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="post in posts" :key="post.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ post.id }}</td>
          <td class="px-6 py-4 text-sm text-gray-500 break-words" style="width: 30%;">{{ post.title }}</td>
          <td class="px-6 py-4 text-sm text-gray-500 break-words" style="width: 60%;">{{ post.body }}</td>
        </tr>
        </tbody>
      </table>
      <div class="flex justify-between mt-4">
        <button @click="previousPage" :disabled="currentPage <= 1" class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300">Previous</button>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
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
