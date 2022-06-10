import React from 'react'

const Carousel = ({location}) => {
  console.log(location.title + " " + location.cover)
  return (
    <div id={`id-${location._id}`} class="carousel slide relative" data-bs-ride="carousel">
      <div class="carousel-inner relative w-full h-48 overflow-hidden">
        <div class="carousel-item active relative float-left w-full overflow-y-auto">
          <img
            src={location.cover}
            class="block rounded-t-lg w-full h-48 object-contain"
            alt="Wild Landscape"
          />
        </div>
        
        {
          location.img2 ? (
            <div class="carousel-item relative float-left w-full">
              <img
                src={location.img2}
                class="block rounded-t-lg w-full h-48 object-contain"
                alt="Camera"
              />
            </div>
          ) : (
            <></>
          )
        }

        {
          location.img3 ? (
            <div class="carousel-item relative float-left w-full">
              <img
                src={location.img3}
                class="block rounded-t-lg w-full h-48 object-contain"
                alt="Camera"
              />
            </div>
          ) : (
            <></>
          )
        }

        {
          location.img4 ? (
            <div class="carousel-item relative float-left w-full">
              <img
                src={location.img4}
                class="block rounded-t-lg w-full h-48 object-contain"
                alt="Camera"
              />
            </div>
          ) : (
            <></>
          )
        }

        {
          location.img5 ? (
            <div class="carousel-item relative float-left w-full">
              <img
                src={location.img5}
                class="block rounded-t-lg w-full h-48 object-contain"
                alt="Camera"
              />
            </div>
          ) : (
            <></>
          )
        }
        
      </div>
      <button
        class="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
        type="button"
        data-bs-target={`#id-${location._id}`}
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon inline-block bg-no-repeat" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
        type="button"
        data-bs-target={`#id-${location._id}`}
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon inline-block bg-no-repeat" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Carousel