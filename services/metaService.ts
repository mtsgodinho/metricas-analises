
import { AdAccount, MetaMetric } from "../types";

const GRAPH_API_VERSION = 'v18.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export const fetchAdAccounts = async (accessToken: string): Promise<AdAccount[]> => {
  const response = await fetch(`${BASE_URL}/me/adaccounts?fields=name,account_id&access_token=${accessToken}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Falha ao buscar contas de anúncio");
  }
  const result = await response.json();
  return result.data;
};

export const fetchAdAccountInsights = async (accessToken: string, adAccountId: string): Promise<MetaMetric[]> => {
  const fields = [
    'date_start',
    'spend',
    'impressions',
    'clicks',
    'actions',
    'action_values',
    'inline_link_click_ctr',
    'cost_per_inline_link_click',
  ].join(',');

  const response = await fetch(
    `${BASE_URL}/${adAccountId}/insights?fields=${fields}&time_increment=1&period=last_7d&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Falha ao buscar insights");
  }

  const result = await response.json();
  
  // Mapear dados da API para o nosso formato interno
  return result.data.map((item: any) => {
    const spend = parseFloat(item.spend || '0');
    const revenue = parseFloat(item.action_values?.find((v: any) => v.action_type === 'offsite_conversion.fb_pixel_purchase')?.value || '0');
    const conversions = parseInt(item.actions?.find((v: any) => v.action_type === 'offsite_conversion.fb_pixel_purchase')?.value || '0', 10);
    const clicks = parseInt(item.clicks || '0', 10);

    return {
      date: item.date_start,
      spend,
      impressions: parseInt(item.impressions || '0', 10),
      clicks,
      conversions,
      revenue,
      ctr: parseFloat(item.inline_link_click_ctr || '0'),
      cpc: parseFloat(item.cost_per_inline_link_click || '0'),
      cpa: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? revenue / spend : 0
    };
  }).reverse(); // API retorna do mais novo pro mais antigo, queremos o contrário para os gráficos
};
