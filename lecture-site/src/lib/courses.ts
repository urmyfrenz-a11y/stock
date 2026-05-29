export type Course = {
  id: string
  name: string
  description: string
  duration: string
  level: string
  price: number
  topics: string[]
  icon: string
}

export const COURSES: Course[] = [
  {
    id: 'lte-5g',
    name: 'LTE/5G 이동통신 기술 과정',
    description: '3GPP 표준 기반의 LTE/5G 핵심 기술부터 네트워크 아키텍처, 무선 접속 기술까지 현장 중심으로 학습합니다.',
    duration: '3일 (21시간)',
    level: '중급~고급',
    price: 500000,
    topics: ['LTE/5G 아키텍처', 'NR 무선 접속 기술', '코어 네트워크 (EPC/5GC)', '네트워크 슬라이싱', '28GHz mmWave', 'O-RAN 기술'],
    icon: '📡',
  },
  {
    id: 'iot',
    name: 'IoT 사물인터넷 실무 과정',
    description: '센서부터 클라우드까지 IoT 전 스택을 다루며, 실제 산업 현장 사례를 통해 실무 역량을 강화합니다.',
    duration: '2일 (14시간)',
    level: '초급~중급',
    price: 450000,
    topics: ['IoT 플랫폼 아키텍처', 'MQTT/CoAP 프로토콜', '엣지 컴퓨팅', 'LoRa/NB-IoT', '스마트팩토리', 'IoT 보안'],
    icon: '🌐',
  },
  {
    id: 'tcp-ip',
    name: 'TCP/IP 네트워크 기초/심화',
    description: 'OSI 7계층부터 라우팅, 스위칭, QoS까지 네트워크의 원리를 체계적으로 이해하고 실무에 적용합니다.',
    duration: '2일 (14시간)',
    level: '기초~심화',
    price: 400000,
    topics: ['OSI 7계층 이해', 'IP 주소 체계', 'TCP/UDP 프로토콜', '라우팅 프로토콜', 'IPv6 전환', 'SDN/NFV'],
    icon: '🔗',
  },
  {
    id: 'gen-ai',
    name: 'Gen AI 생성형 AI 활용 과정',
    description: 'ChatGPT, Claude, Gemini 등 최신 생성형 AI 도구를 업무에 실전 적용하는 방법을 배웁니다.',
    duration: '2일 (14시간)',
    level: '초급~중급',
    price: 550000,
    topics: ['LLM 원리 이해', 'Prompt Engineering', 'RAG 기술', 'ChatGPT/Claude 활용', 'AI 에이전트', '기업 업무 적용'],
    icon: '🤖',
  },
  {
    id: 'data-science',
    name: 'Data Science 데이터 분석 과정',
    description: '데이터 수집부터 시각화, 머신러닝까지 데이터 기반 의사결정을 위한 실무 분석 능력을 배양합니다.',
    duration: '3일 (21시간)',
    level: '초급~중급',
    price: 480000,
    topics: ['Python 데이터 분석', 'Pandas/NumPy', '데이터 시각화', '머신러닝 기초', '통계 분석', '비즈니스 인사이트'],
    icon: '📊',
  },
]
