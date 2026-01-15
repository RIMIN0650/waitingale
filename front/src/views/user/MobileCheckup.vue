<script>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
</script>

<template>
  <div class="text-slate-900 pb-32">

    <!-- 상단 네비 -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <button @click="prevStep" class="text-slate-400 hover:text-slate-600">
        <i class="fa-solid fa-chevron-left text-lg"></i>
      </button>

      <h1 class="text-lg font-bold tracking-tight">
        모바일 문진표 ({{ currentStep }}/3)
      </h1>

      <div class="w-6"></div>
    </nav>

    <main class="max-w-2xl mx-auto px-6 py-8">

      <!-- 단계 표시 -->
      <div class="flex items-center justify-center gap-3 mb-10">
        <template v-for="n in 3" :key="n">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            :class="n <= currentStep ? 'step-active' : 'step-inactive'"
          >
            {{ n }}
          </div>
          <div v-if="n < 3" class="w-12 h-0.5 bg-slate-200"></div>
        </template>
      </div>

      <!-- STEP 1 -->
      <section v-if="currentStep === 1" class="space-y-10">
        <div>
          <h2 class="text-xl font-bold mb-2">현재 가장 불편한 증상은 무엇인가요?</h2>
          <p class="text-sm text-slate-500 mb-6">중복 선택 가능</p>

          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="s in symptoms"
              :key="s"
              type="button"
              @click="toggleSymptom(s)"
              class="choice-btn p-4 border-2 rounded-2xl font-bold text-sm text-left transition"
              :class="selectedSymptoms.includes(s) ? selectedClass : normalClass"
            >
              {{ s }}
            </button>

            <button
              type="button"
              @click="toggleOther"
              class="choice-btn p-4 border-2 rounded-2xl font-bold text-sm text-left flex justify-between"
              :class="otherSymptom ? selectedClass : normalClass"
            >
              기타 <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>

          <input
            v-if="otherSymptom"
            v-model="otherText"
            class="mt-3 w-full p-4 bg-slate-50 border border-indigo-200 rounded-2xl text-sm"
            placeholder="직접 입력"
          />
        </div>
      </section>

      <!-- STEP 2 -->
      <section v-if="currentStep === 2" class="space-y-10">
        <div>
          <h2 class="text-xl font-bold mb-4">과거 병력</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="d in diseases"
              :key="d"
              @click="toggleDisease(d)"
              class="px-5 py-3 rounded-full border text-sm font-semibold transition"
              :class="selectedDiseases.includes(d) ? selectedClass : normalClass"
            >
              {{ d }}
            </button>
          </div>
        </div>
      </section>

      <!-- STEP 3 -->
      <section v-if="currentStep === 3">
        <div class="bg-indigo-600 rounded-[32px] p-8 text-white mb-8">
          <h2 class="text-2xl font-bold mb-4">
            모든 정보를 확인했습니다.<br />전송할까요?
          </h2>
        </div>
      </section>
    </main>

    <!-- 하단 버튼 -->
    <div class="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-slate-100">
      <div class="max-w-2xl mx-auto flex gap-3">
        <button
          class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center"
          @click="showToast"
        >
          <i class="fa-solid fa-floppy-disk"></i>
        </button>

        <button
          v-if="currentStep < 3"
          @click="nextStep"
          class="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl"
        >
          다음 단계
        </button>

        <RouterLink
          v-else
          to="/reservation"
          class="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center"
        >
          제출하기
        </RouterLink>
      </div>
    </div>

    <!-- 토스트 -->
    <div
      v-if="toast"
      class="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full text-sm"
    >
      임시 저장되었습니다
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const toast = ref(false)

const symptoms = ['발열 / 오한', '기침 / 가래', '두통 / 어지럼증']
const diseases = ['당뇨', '고혈압', '간질환', '심장질환']

const selectedSymptoms = ref([])
const selectedDiseases = ref([])
const otherSymptom = ref(false)
const otherText = ref('')

const selectedClass = 'border-indigo-600 bg-indigo-50 text-indigo-600'
const normalClass = 'border-slate-200 bg-white text-slate-600'

const nextStep = () => currentStep.value++
const prevStep = () => currentStep.value > 1 && currentStep.value--

const toggleSymptom = s =>
  selectedSymptoms.value.includes(s)
    ? selectedSymptoms.value.splice(selectedSymptoms.value.indexOf(s), 1)
    : selectedSymptoms.value.push(s)

const toggleDisease = d =>
  selectedDiseases.value.includes(d)
    ? selectedDiseases.value.splice(selectedDiseases.value.indexOf(d), 1)
    : selectedDiseases.value.push(d)

const toggleOther = () => {
  otherSymptom.value = !otherSymptom.value
  if (!otherSymptom.value) otherText.value = ''
}

const showToast = () => {
  toast.value = true
  setTimeout(() => (toast.value = false), 2000)
}
</script>
