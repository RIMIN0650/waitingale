<script setup>

</script>

<template>
    <footer class="footer">
    <div class="footer-top">
        <nav class="footer-nav">
            <a href="#">회사소개</a>
            <a href="#">병원 · 약국 가입문의</a>
            <a href="#">이용약관</a>
            <a href="#">개인정보 처리방침</a>
        </nav>

        <div class="footer-content">
            <!-- 회사 정보 -->
            <div class="footer-col">
                <h4>주식회사 MediQ</h4>
                <p>대표 권민석, 김미정, 노승찬, 이한별</p>
                <p>서울특별시 동작구 신대방동 344-4</p>
                <p>사업자등록번호 431-88-01818</p>
                <p>통신판매업신고번호 제2020-서울강남-00257호</p>
                <p>WaitinGale@MediQ.co.kr</p>
            </div>

            <!-- 고객센터 -->
            <div class="footer-col">
                <h4>고객센터</h4>
                <p class="tel">1588-8282</p>
                <p>운영시간 09:00 ~ 18:00</p>
                <button class="chat-btn">1:1 채팅상담</button>
            </div>

            <!-- 소셜 -->
            <div class="footer-col">
                <h4>소셜</h4>
                <ul class="icon-list">
                    <li>Instagram</li>
                </ul>
            </div>

            <!-- 앱 다운로드 -->
            <div class="footer-col">
                <h4>앱 다운로드</h4>
                <ul class="icon-list">
                    <li>App Store</li>
                    <li>Google Play</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <p>All right reserved. ©MediQ</p>

        <div class="cert">
            <p><strong>[인증범위]</strong> MediQ 서비스 플랫폼</p>
            <p><strong>[유효기간]</strong> 2024.02.07 - 2027.02.06</p>
        </div>

        <p class="notice">
            (주)MediQ는 의료정보의 중개서비스 또는 의료정보중개시스템의 제공자로서,
            의료정보의 당사자가 아니며, 의료정보와 관련된 의무와 책임은 각 의료기관에 있습니다.
        </p>
    </div>
</footer>
</template>

<style scoped>
.footer {
    background: #fff;
    color: #666;
    border-top: 1px solid #eee;
}

.footer-top {
    padding: 40px 80px;
}

.footer-nav {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
}

.footer-nav a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
}

.footer-content {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1fr 1fr;
    gap: 40px;
}

.footer-col h4 {
    font-size: 15px;
    margin-bottom: 12px;
    color: #222;
}

.footer-col p,
.footer-col li {
    font-size: 13px;
    line-height: 1.6;
}

.tel {
    font-size: 16px;
    font-weight: bold;
    margin: 6px 0;
}

.chat-btn {
    margin-top: 10px;
    padding: 8px 14px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    border-radius: 6px;
}

.icon-list {
    list-style: none;
    padding: 0;
}

.icon-list li {
    margin-bottom: 8px;
}

.footer-bottom {
    border-top: 1px solid #f0f0f0;
    padding: 25px 80px;
    font-size: 12px;
    color: #888;
}

.cert {
    margin: 15px 0;
}

.notice {
    max-width: 900px;
    line-height: 1.6;
}
</style>