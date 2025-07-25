import axios from 'axios';

export async function checkAppiumStatus(port: number): Promise<boolean> {
  try {
    const res = await axios.get(`http://localhost:${port}/wd/hub/status`);
    return res.status === 200 && res.data.value?.ready === true;
  } catch {
    return false;
  }
}
