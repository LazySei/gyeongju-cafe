export async function onRequest(context) {
    const API_KEY = context.env.API_KEY; 
    if (!API_KEY) {
        return new Response(JSON.stringify({ error: "환경변수 API_KEY가 설정되지 않았습니다." }), { status: 500 });
    }

    // 💡 확인하신 기본 URL
    const baseUrl = "https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo"; 
    
    // ⚠️ 주의: API 명세서를 확인하여 baseUrl 뒤에 '/getCafeList' 같은 오퍼레이션 명이 필요한지 반드시 확인하세요.
    // 또한 JSON 요청 파라미터가 'type=json'인지, '_type=json'인지 명세서 확인이 필요합니다.
    const url = `${baseUrl}?serviceKey=${encodeURIComponent(API_KEY)}&pageNo=1&numOfRows=50&type=json`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // 브라우저 위장 (방화벽 차단 방지)
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const textData = await response.text();
        
        // 💡 디버깅 로직: 응답이 JSON 형태({ 또는 [)로 시작하지 않으면, 파싱하지 않고 원문을 그대로 반환
        const trimmedText = textData.trim();
        if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
             return new Response(JSON.stringify({ 
                error: "공공데이터포털에서 JSON이 아닌 데이터를 반환했습니다. 아래 상세 내용을 확인하세요.", 
                details: trimmedText, // XML 에러 메시지 또는 HTML 에러 페이지가 여기에 담김
                requestUrl: url
            }), { 
                status: 502,
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });
        }

        // 정상적인 JSON 응답일 경우
        const jsonData = JSON.parse(trimmedText);
        
        return new Response(JSON.stringify(jsonData), {
            headers: { 
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            error: "데이터 호출 중 서버 내부 오류 발생", 
            message: error.message,
            requestUrl: url
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
    }
}
