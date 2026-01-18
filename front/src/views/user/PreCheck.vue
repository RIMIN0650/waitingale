<template>
  <div class="text-slate-900 pb-32">
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <button @click="prevStep" class="text-slate-400 hover:text-slate-600">
        <i class="fa-solid fa-chevron-left text-lg"></i>
      </button>
      <h1 class="text-lg font-bold tracking-tight">모바일 문진표 ({{ currentStep }}/3)</h1>
      <div class="w-6"></div>
    </nav>

    <main class="max-w-2xl mx-auto px-6 py-8">
      <!-- Step Dots -->
      <div class="flex items-center justify-center gap-3 mb-10">
        <div v-for="n in 3" :key="n" :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', n <= currentStep ? 'step-active' : 'step-inactive']">{{ n }}</div>
      </div>

      <!-- STEP 1 -->
      <section v-if="currentStep === 1" class="space-y-10">
        <div>
          <h2 class="text-xl font-bold mb-2">현재 가장 불편한 증상은 무엇인가요?</h2>
          <p class="text-sm text-slate-500 mb-6">중복 선택이 가능합니다.</p>
          <div class="grid grid-cols-2 gap-3">
            <button v-for="s in symptoms" :key="s" @click="toggleSymptom(s)" :class="symptomClass(s)">{{ s }}</button>
            <button @click="toggleOther" :class="symptomClass('기타')" class="flex items-center justify-between">
              기타 <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          <input v-if="showOther" v-model="otherSymptom" class="mt-3 w-full p-4 border rounded-2xl" placeholder="직접 입력" />
        </div>
      </section>

      <!-- STEP 2 -->
      <section v-if="currentStep === 2" class="space-y-10">
        <div>
          <h2 class="text-xl font-bold mb-2">과거 질환</h2>
          <div class="flex flex-wrap gap-2">
            <button v-for="d in diseases" :key="d" @click="toggleDisease(d)" :class="pillClass(d)">{{ d }}</button>
          </div>
        </div>
      </section>

      <!-- STEP 3 -->
      <section v-if="currentStep === 3">
        <div class="bg-indigo-600 text-white p-8 rounded-3xl">
          <h2 class="text-2xl font-bold">전송하시겠습니까?</h2>
        </div>
      </section>
    </main>

    <!-- Bottom Bar -->
    <div class="fixed bottom-0 left-0 right-0 p-6 bg-white border-t flex gap-3">
      <button @click="saveTemp" class="w-14 h-14 bg-slate-100 rounded-2xl">💾</button>
      <button v-if="currentStep < 3" @click="nextStep" class="flex-1 bg-indigo-600 text-white rounded-2xl">다음</button>
      <button v-else class="flex-1 bg-slate-900 text-white rounded-2xl">제출</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const symptoms = ['발열 / 오한', '기침 / 가래', '두통 / 어지럼증']
const diseases = ['당뇨', '고혈압', '간질환', '심장질환']

const selectedSymptoms = ref([])
const selectedDiseases = ref([])
const showOther = ref(false)
const otherSymptom = ref('')

const toggleSymptom = (s) => {
  selectedSymptoms.value.includes(s)
    ? selectedSymptoms.value = selectedSymptoms.value.filter(v => v !== s)
    : selectedSymptoms.value.push(s)
}

const toggleDisease = (d) => {
  selectedDiseases.value.includes(d)
    ? selectedDiseases.value = selectedDiseases.value.filter(v => v !== d)
    : selectedDiseases.value.push(d)
}

const toggleOther = () => showOther.value = !showOther.value

const symptomClass = (s) => [
  'choice-btn p-4 border-2 rounded-2xl text-sm font-bold',
  selectedSymptoms.value.includes(s) || (s === '기타' && showOther.value)
    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
    : 'border-slate-200 bg-white'
]

const pillClass = (d) => [
  'px-5 py-3 rounded-full border text-sm font-semibold',
  selectedDiseases.value.includes(d) ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200'
]

const nextStep = () => currentStep.value++
const prevStep = () => currentStep.value > 1 && currentStep.value--
const saveTemp = () => alert('임시 저장')
</script>

<style scoped>
.step-active { background:#4f46e5; color:white }
.step-inactive { background:#e2e8f0; color:#94a3b8 }
</style>
