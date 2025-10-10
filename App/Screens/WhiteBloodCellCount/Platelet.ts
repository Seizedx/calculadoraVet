export interface PlateletCount {
  id: string;
  animalName: string;
  species: 'dog' | 'cat';
  age: number;
  weight: number;
  plateletCount: number;
  date: Date;
  notes?: string;
}

export interface ReferenceValues {
  dog: {
    normal: { min: number; max: number };
    low: number;
    high: number;
  };
  cat: {
    normal: { min: number; max: number };
    low: number;
    high: number;
  };
}

export const REFERENCE_VALUES: ReferenceValues = {
  dog: {
    normal: { min: 200000, max: 500000 },
    low: 200000,
    high: 500000,
  },
  cat: {
    normal: { min: 300000, max: 800000 },
    low: 300000,
    high: 800000,
  },
};

export type PlateletStatus = 'normal' | 'low' | 'high';

export function analyzePlateletCount(count: number, species: 'dog' | 'cat'): {
  status: PlateletStatus;
  interpretation: string;
  recommendations: string[];
} {
  const ref = REFERENCE_VALUES[species];
  let status: PlateletStatus;
  let interpretation: string;
  let recommendations: string[];

  if (count < ref.low) {
    status = 'low';
    interpretation = 'Trombocitopenia - Contagem de plaquetas abaixo do normal';
    recommendations = [
      'Investigar causas de trombocitopenia',
      'Avaliar histórico de medicamentos',
      'Considerar doenças autoimunes',
      'Monitorar sinais de sangramento',
      'Repetir exame em 3-7 dias',
    ];
  } else if (count > ref.high) {
    status = 'high';
    interpretation = 'Trombocitose - Contagem de plaquetas acima do normal';
    recommendations = [
      'Investigar causas de trombocitose',
      'Avaliar processos inflamatórios',
      'Considerar doenças neoplásicas',
      'Verificar desidratação',
      'Repetir exame para confirmação',
    ];
  } else {
    status = 'normal';
    interpretation = 'Contagem de plaquetas dentro dos valores normais';
    recommendations = [
      'Manter acompanhamento de rotina',
      'Continuar cuidados preventivos',
    ];
  }

  return { status, interpretation, recommendations };
}