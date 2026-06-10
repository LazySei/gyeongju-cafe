export async function onRequest(context) {
    // Cloudflare 환경변수에서 API 키 가져오기
    const API_KEY = context.env.API_KEY; 
    
    // 공공데이터 API 엔드포인트 (실제 요청 주소로 변경 필요)
    const baseUrl = "http://apis.data.go.kr/15114467/openapi.do/getCafeInfo";
    
    // 파라미터 조합 (JSON 형태로 요청)
    const url = `${baseUrl}?serviceKey=${API_KEY}&pageNo=1&numOfRows=50&type=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            headers: { 
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "데이터 호출 실패" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}