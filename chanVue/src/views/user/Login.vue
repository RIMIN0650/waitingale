<script setup>

</script>

<template>
    <div class="bg-white flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-6">
        <div class="text-center mb-10">
            <a href="index.html" class="inline-block mb-6">
                <img src="@/assets/images/mediQ_logo.png" alt="MediQ Logo" class="w-16 h-16 object-contain mx-auto">
            </a>
            <h1 class="text-2xl font-bold mb-2">로그인</h1>
            <p class="text-sm text-slate-400">서비스 이용을 위해 로그인해주세요.</p>
        </div>
        

        <form action="index.html" class="space-y-4 mb-8">
            <div class="bg-slate-50 rounded-2xl flex items-center px-4 py-3 border border-slate-100">
                <i class="fa-solid fa-envelope text-slate-300 mr-3"></i>
                <input type="email" placeholder="이메일" class="bg-transparent w-full outline-none text-sm" required>
            </div>
            <div class="bg-slate-50 rounded-2xl flex items-center px-4 py-3 border border-slate-100">
                <i class="fa-solid fa-lock text-slate-300 mr-3"></i>
                <input type="password" placeholder="비밀번호" class="bg-transparent w-full outline-none text-sm" required>
            </div>
            <button type="submit" id="login-btn" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg">로그인</button>
        </form>

        <div class="flex justify-center gap-4 mt-8 text-xs font-bold">
                <RouterLink to="/signup" class="text-slate-400 hover:text-slate-600">회원가입</RouterLink>
                <span class="text-slate-200">|</span>
                <a href="/user/UserFindId" class="text-slate-400 hover:text-slate-600">아이디 찾기</a>
                <span class="text-slate-200">|</span>
                <a href="pw_find.html" class="text-slate-400 hover:text-slate-600">비밀번호 찾기</a>
        </div>
    </div>
    </div>


</template>

<style scoped>

</style>