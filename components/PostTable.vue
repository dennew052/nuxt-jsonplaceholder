<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const currentPage = ref(1)
const postsPerPage = 10
const posts = ref([])
const totalPosts = ref(0)
const sortKey = ref('id')
const sortOrder = ref('asc')

const isModalOpen = ref(false)
const newPost = ref({ title: '', body: '' })

const fetchPosts = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
    posts.value = response.data
    totalPosts.value = response.data.length
    sortPosts()
  } catch (error) {
    console.error(error)
  }
}

const sortPosts = () => {
  posts.value.sort((a, b) => {
    const multiplier = sortOrder.value === 'asc' ? 1 : -1
    return (a[sortKey.value] - b[sortKey.value]) * multiplier
  })
}

const sortedPosts = computed(() => [...posts.value])

const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return sortedPosts.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  sortPosts()
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const addPost = async () => {
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost.value)
    posts.value.unshift(response.data)
    totalPosts.value++
    closeModal()
    currentPage.value = 1
  } catch (error) {
    console.error(error)
  }
}

fetchPosts()
</script>

<template>
  <div class="p-4">
    <div class="max-w-[1366px] mx-auto">
      <button @click="openModal" class="bg-green-500 text-white px-4 py-2 rounded-md mb-4">Добавить новый пост</button>

      <!-- Модальное окно -->
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
        <div class="bg-white p-6 rounded-lg shadow-lg sm:w-1/3">
          <h2 class="text-xl font-bold mb-4">Добавить новый пост</h2>
          <form @submit.prevent="addPost">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">Название</label>
              <input v-model="newPost.title" id="title" type="text" class="h-8 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div class="mb-4">
              <label for="body" class="block text-sm font-medium text-gray-700">Текст</label>
              <textarea v-model="newPost.body" id="body" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required></textarea>
            </div>
            <div class="flex justify-between">
              <button @click="closeModal" type="button" class="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Отменить</button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Сохранить</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Таблица -->
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 10%;">
            <button @click="sortBy('id')" class="mx-auto flex items-center space-x-1">
              ID
              <svg v-if="sortKey === 'id' && sortOrder === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              <svg v-if="sortKey === 'id' && sortOrder === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
              </svg>
            </button>
          </th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 30%;">Название</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style="width: 60%;">Текст</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="post in paginatedPosts" :key="post.id" :style="{ backgroundColor: post.id > 100 ? '#d6ffd6' : '' }">
          <td class="px-6 py-4 text-center text-sm font-medium text-gray-900">{{ post.id }}</td>
          <td class="px-6 py-4 text-justify text-sm text-gray-500 break-words">{{ post.title }}</td>
          <td class="px-6 py-4 text-justify text-sm text-gray-500 break-words">{{ post.body }}</td>
        </tr>
        </tbody>
      </table>
      <div class="flex justify-between mt-4">
        <button @click="previousPage" :disabled="currentPage <= 1" class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300">Назад</button>
        <div>Страница: {{ currentPage }} / {{ totalPages }}</div>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300">Далее</button>
      </div>
    </div>
  </div>
</template>
