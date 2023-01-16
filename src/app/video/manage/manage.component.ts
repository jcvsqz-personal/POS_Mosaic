import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs'
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  clips: IClip[] = []
  videoOrder = '1'
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string> 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipsService: ClipService,
    private modal:ModalService
    ) {
      this.sort$ = new BehaviorSubject(this.videoOrder)
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.videoOrder)
    })

    this.clipsService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []
      docs.forEach(doc =>{
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(e: Event){
    const { value } = (e.target as HTMLSelectElement)

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams:{
        sort: value
      }
    })
    // this.router.navigateByUrl(`/manage?sort=${value}`)

    e.preventDefault()
  }

  openModal(e: Event, clip: IClip){
    e.preventDefault()

    this.activeClip = clip
    this.modal.toggleModal('editClip')
  } 

  update(e: any){
    console.log(e)
    this.clips.forEach((element,index) => {
      if(element.docID == e.docID){
        this.clips[index].title = e.title
      }
    })
  }

  deleteClip(e: Event, clip: IClip){
    e.preventDefault()

    this.clipsService.deleteClip(clip)
    this.clips.forEach((el, index) => {
      if(el.docID == clip.docID){
        this.clips.splice(index, 1)
      }
    })
  }
}
