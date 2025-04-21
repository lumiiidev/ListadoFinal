import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiciosService } from '../../services/services.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { IpDialogComponent } from '../../dialogShowIP/ip-dialog/ip-dialog.component';


@Component({
  selector: 'app-ip-availability',
  imports:[CommonModule, MatTableModule, MatPaginator],
  templateUrl: './ip.component.html',
  styleUrls: ['./ip.component.css'],
})

export class IpComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  segments = [
    '172.16.51.0/24', '172.16.52.0/24', '172.16.53.0/24',
    '172.16.54.0/24', '172.16.55.0/24', '172.16.56.0/24'
  ];
  ipStats: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['segment', 'used', 'available', 'showAvailable'];
  segment: string = '';

  constructor(private servicio: ServiciosService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.servicio.obtenerUsuarios().subscribe(res => {
      const users = res.data;
      this.ipStats = this.calculateIpStats(users);
      this.dataSource.data = this.ipStats;
    });
  }

  calculateIpStats(users: any[]): any[] {
    return this.segments.map(segment => {
      const base = segment.split('/')[0];
      const [a, b, c] = base.split('.').map(Number);
      const usedIps = users
        .map(u => u.ip_address)
        .filter(ip => ip.startsWith(`${a}.${b}.${c}.`));
      const available = 254 - usedIps.length;
      const allIps = Array.from({ length: 254 }, (_, i) => `${a}.${b}.${c}.${i + 1}`);
      const availableIps = allIps.filter(ip => !usedIps.includes(ip));
      return {
        segment,
        used: usedIps.length,
        available,
        availableIps
      };
    });
  }

  showIps(segment: string) {
    const segmentData = this.ipStats.find(stat => stat.segment === segment);
    if (segmentData) {
      this.dialog.open(IpDialogComponent, {
        width: '400px',
        data: {
          segment: segmentData.segment,
          ips: segmentData.availableIps
        }
      });
    }
  }  

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
