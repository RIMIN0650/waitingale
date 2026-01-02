// 지도 초기화 (메인 페이지에 지도가 있을 때만 실행)
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        const MY_LOCATION = [37.5598, 126.9425]; // 신촌
        
        const map = L.map('map', { zoomControl: false }).setView(MY_LOCATION, 15);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap', maxZoom: 19
        }).addTo(map);

        // 내 위치 마커
        const myIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="my-location-pulse"></div>`,
            iconSize: [20, 20], iconAnchor: [10, 10]
        });
        L.marker(MY_LOCATION, {icon: myIcon}).addTo(map).bindPopup("<b>현재 위치</b>");

        // 병원 데이터 예시
        const hospitals = [
            { lat: 37.5623, lng: 126.9366, color: "#10b981", icon: "fa-solid fa-hospital" }, // 세브란스
            { lat: 37.5640, lng: 126.9400, color: "#f59e0b", icon: "fa-solid fa-child-reaching" }, // 소아과
            { lat: 37.5580, lng: 126.9380, color: "#f43f5e", icon: "fa-solid fa-truck-medical" } // 응급실
        ];

        hospitals.forEach(h => {
            const iconHtml = `<div style="background-color:${h.color};" class="marker-pin"></div><i class="${h.icon} marker-icon" style="color:${h.color};"></i>`;
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: iconHtml,
                iconSize: [30, 42], iconAnchor: [15, 42]
            });
            L.marker([h.lat, h.lng], {icon: customIcon}).addTo(map);
        });

        // 내 위치로 이동 버튼
        window.panToMyLocation = () => {
            map.setView(MY_LOCATION, 15, { animate: true });
        };
    }
});

// 간단한 알림창 표시 함수
function showMessage(msg) {
    alert(msg);
}