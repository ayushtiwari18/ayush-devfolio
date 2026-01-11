import Image from 'next/image';
import { ExternalLink, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';

export function HackathonCard({ hackathon }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {hackathon.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={hackathon.image_url}
            alt={hackathon.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            {hackathon.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hackathon.organizer}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{hackathon.role}</Badge>
          {hackathon.result && (
            <Badge variant="default" className="flex items-center gap-1">
              <Trophy size={12} />
              {hackathon.result}
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {formatDate(hackathon.event_date)}
        </p>

        {hackathon.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {hackathon.description}
          </p>
        )}

        {hackathon.project_url && (
          <a
            href={hackathon.project_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink size={14} className="mr-2" />
              View Project
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
