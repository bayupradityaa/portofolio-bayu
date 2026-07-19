import { getAllCertificates, createCertificate, updateCertificate, deleteCertificate, toggleCertificatePublished } from "@/lib/actions/certificates";
import { CertificatesClient } from "./certificates-client";

export default async function AdminCertificatesPage() {
  const data = await getAllCertificates();
  return <CertificatesClient data={data} />;
}
