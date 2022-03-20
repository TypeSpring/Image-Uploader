package com.example.imageuploader.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.imageuploader.service.ImageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin
@RequestMapping("/api/v1/images")
@Slf4j
@RequiredArgsConstructor
@RestController
public class ImageController {
    private final ImageService imageService;

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<String> execWrite(@RequestPart MultipartFile file) throws IOException {
        String imgPath = imageService.upload(file);
        log.info("imagePath = {}", imgPath);
        return ResponseEntity.ok(imgPath);
    }

    @PostMapping(value = "/bulk", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<List<String>> execWriteBulk(@RequestPart List<MultipartFile> file) throws IOException {
        final List<String> urls = file.stream()
                                      .map(multipartFile -> {
                                          try {
                                              return imageService.upload(multipartFile);
                                          } catch (IOException e) {
                                              log.error("image bulk upload error... ", e);
                                              return null;
                                          }
                                      }).peek(s -> log.info("imagePath = {}", s))
                                      .collect(Collectors.toList());

        return ResponseEntity.ok(urls);
    }
}

