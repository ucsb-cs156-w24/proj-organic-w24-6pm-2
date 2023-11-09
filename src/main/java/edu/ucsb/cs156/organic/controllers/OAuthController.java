package edu.ucsb.cs156.organic.controllers;

import java.util.Map;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class OAuthController {

    @GetMapping("/login/oauth2/code/{registrationId}")
    public String loginSuccess(@PathVariable String registrationId)  {
        // You can access the user's details, including the access token, from
        // oauth2User
        log.info("registrationId={}", registrationId);

        // Your logic here
        return "redirect:/";
    }

    // @GetMapping("/login/success")
    // public String loginSuccess(@AuthenticationPrincipal OAuth2User oauth2User,
    // @RequestParam Map<String, String> params)  {
    //     // You can access the user's details, including the access token, from
    //     // oauth2User
    //     String accessToken = oauth2User.getAttribute("access_token");
    //     log.info("oauth2User={}", oauth2User);
    //     log.info("accessToken={}", accessToken);
    //     log.info("params={}", params);

    //     // Your logic here
    //     return "redirect:/";
    // }
}