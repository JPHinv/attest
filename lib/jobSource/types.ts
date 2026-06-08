/**
 * BEVROREN CONTRACT (golf 1).
 *
 * Dit is de bron-van-waarheid voor het Job-model en de JobSource-interface.
 * Golf-2-workers (overzicht- en detailpagina) bouwen HIEROP. Wijzig deze
 * types NIET zonder expliciete contract-revisie — anders breekt golf 2.
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  branche: string;
  type: string;
  description: string;
  postedAt: string;
  applyUrl: string;
}

export interface JobSource {
  getAllJobs(): Job[];
  getJobById(id: string): Job | undefined;
}
