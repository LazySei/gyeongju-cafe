export async function onRequest(context) {
    const API_KEY = context.env.API_KEY; 
    if (!API_KEY) {
        return new Response(JSON.stringify({ error: "환경변수 API_KEY가 설정되지 않았습니다." }), { status: 500 });
    }

    // 🔴 중요: 아래 baseUrl을 공공데이터포털 마이페이지에 적힌 '실제 요청주소'로 반드시 변경하세요.
    // (https가 아닌 http로 시작해야 합니다)
    const baseUrl = "https://apis.data.go.kr/5050000/cafeInfoService/getCafeInfo"; 
    
    // API 키 인코딩 처리
    const url = `${baseUrl}?serviceKey=${API_KEY}&pageNo=1&numOfRows=50`;

    try {
        const response = await fetch(url);
        const textData = await response.text();
        
        // 공공데이터포털이 JSON이 아닌 텍스트(Unexpected errors 등)나 XML 에러를 반환한 경우 처리
 if (textData.includes('Unexpected errors') || textData.includes('502') || textData.startsWith('<')) {
             return new Response(JSON.stringify({ 
                error: "공공데이터포털 서버 통신 오류", 
                details: textData.trim(),
                requestUrl: url // 💡 디버깅용: 실제 요청한 URL
            }), { 
                status: 502,
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });
        }

        // 정상적인 JSON 응답일 경우
        const jsonData = JSON.parse(textData);
        
        return new Response(JSON.stringify(jsonData), {
            headers: { 
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            error: "데이터 호출 중 서버 내부 오류 발생", 
            message: error.message 
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
    }
}
