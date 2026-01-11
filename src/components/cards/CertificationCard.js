import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateShort } from '@/utils/formatDate';

export function CertificationCard({ certification }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {certification.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={certification.image_url}
            alt={certification.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            {certification.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {certification.issuer}
          </p>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">
          Issued: {formatDateShort(certification.issued_date)}
          {certification.expiry_date && (
            <> • Expires: {formatDateShort(certification.expiry_date)}</>
          )}
        </p>

        {certification.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {certification.description}
          </p>
        )}

        {certification.certificate_url && (
          <a
            href={certification.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink size={14} className="mr-2" />
              View Certificate
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
